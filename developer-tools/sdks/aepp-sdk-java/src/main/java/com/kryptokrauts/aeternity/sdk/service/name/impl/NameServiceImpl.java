package com.kryptokrauts.aeternity.sdk.service.name.impl;

import com.kryptokrauts.aeternity.generated.api.rxjava.ExternalApi;
import com.kryptokrauts.aeternity.sdk.service.aeternity.AeternityServiceConfiguration;
import com.kryptokrauts.aeternity.sdk.service.name.NameService;
import com.kryptokrauts.aeternity.sdk.service.name.domain.NameIdResult;
import io.reactivex.Single;
import javax.annotation.Nonnull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public final class NameServiceImpl implements NameService {

  @Nonnull private AeternityServiceConfiguration config;

  @Nonnull private ExternalApi externalApi;

  @Override
  public Single<NameIdResult> asyncGetNameId(final String name) {
    return NameIdResult.builder().build().asyncGet(this.externalApi.rxGetNameEntryByName(name));
  }

  @Override
  public NameIdResult blockingGetNameId(String name) {
    return NameIdResult.builder().build().blockingGet(this.externalApi.rxGetNameEntryByName(name));
  }
}
