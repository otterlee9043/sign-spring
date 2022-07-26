package com.sign.domain.member.repository;

import com.sign.domain.member.entity.Member;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@Transactional
public class JpaMemberRepository implements MemberRepository{

    private final EntityManager em;

    @Autowired
    public JpaMemberRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public Member save(Member member) {
        em.persist(member);
        return member;
    }

    @Override
    public Optional<Member> findById(Long memberId) {
        Member member = em.find(Member.class, memberId);
        return Optional.ofNullable(member);
    }

    @Override
    public Optional<Member> findByUsername(String username) {
        return em.createQuery("select m from Member m where m.username =:username", Member.class)
                .setParameter("username", username)
                .getResultList().stream().findAny();
    }

    @Override
    public List<Member> findAll() {

        return em.createQuery("select m from Member m", Member.class).getResultList();
    }

    @Override
    public boolean checkAttached(Member member){
        return em.contains(member);
    }
}
